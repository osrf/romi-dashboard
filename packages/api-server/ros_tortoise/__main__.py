import argparse
import base64
import hashlib
import os.path
from typing import Sequence

import ament_index_python
import jinja2
from rosidl_adapter.parser import MessageSpecification
from rosidl_adapter.parser import Type as RosType
from rosidl_adapter.parser import parse_message_file

templates_dir = f"{os.path.dirname(__file__)}/templates"
env = jinja2.Environment(
    loader=jinja2.FileSystemLoader(templates_dir), trim_blocks=True
)


class MessageMetadata:
    def __init__(self, import_prefix: str, spec: MessageSpecification):
        self.import_prefix = import_prefix
        self.spec = spec


class PackageSpec:
    def __init__(self, pkg_name: str, messages: Sequence[MessageMetadata]):
        self.pkg_name = pkg_name
        self.messages = messages


def ros_to_tortoise_type(ros_type: RosType) -> str:
    """
    tortoise-orm types:
        BigInt
        Binary
        Boolean
        Char
        Date
        DateTime
        Decimal
        Float
        Int
        JSON
        SmallInt
        Text
        TimeDelta
        UUID
    normal mappings:
        bool: Boolean
        int8: SmallInt
        uint8: SmallInt
        int16: SmallInt
        uint16: SmallInt
        int32: Int
        uint32: Int
        int64: BigInt
        uint64: BigInt
        float: Float
        double: Float
        string: Text
        wstring: Binary
        Nested: JSON
    array mappings:
        int8: Binary
        uint8: Binary
        others: JSON
    special:
        builtin_interfaces/Time: DatetimeField (assumed to be utc)
    """
    if ros_type.is_primitive_type():
        if ros_type.is_array:
            if ros_type.type in ["int8", "uint8"]:
                return "fields.BinaryField()"
            else:
                return "fields.JSONField()"

        if ros_type.type == "bool":
            return "fields.BooleanField()"
        elif ros_type.type in ["int8", "uint8"]:
            return "fields.SmallIntField()"
        elif ros_type.type in ["int16", "uint16"]:
            return "fields.SmallIntField()"
        elif ros_type.type in ["int32", "uint32"]:
            return "fields.IntField()"
        elif ros_type.type in ["int64", "uint64"]:
            return "fields.BigIntField()"
        elif ros_type.type in ["float", "double", "float32", "float64"]:
            return "fields.FloatField()"
        elif ros_type.type == "string":
            return "fields.TextField()"
        elif ros_type.type == "wstring":
            return "fields.BinaryField()"
    else:
        if ros_type.__str__() == "builtin_interfaces/Time":
            return "fields.DatetimeField()"
        else:
            return "fields.JSONField()"


def get_import_prefix(pkg_name: str, interface: str) -> str:
    path = interface[: interface.rfind("/")]
    return f"{pkg_name}.{path}"


def gen_mixin(pkg_spec: PackageSpec):
    template = env.get_template("mixin.j2")
    return template.render(
        vars(pkg_spec),
        to_tortoise_type=ros_to_tortoise_type,
    )


def parse_package(pkg: str) -> Sequence[MessageMetadata]:
    rosidl_interfaces = ament_index_python.get_resource("rosidl_interfaces", pkg)[
        0
    ].split("\n")
    message_meta = []
    for interface in rosidl_interfaces:
        if interface.endswith(".msg"):
            file = f"{ament_index_python.get_package_share_directory(pkg)}/{interface}"
            message_meta.append(
                MessageMetadata(
                    get_import_prefix(pkg, interface),
                    parse_message_file(pkg, file),
                )
            )

    return message_meta


def main():
    parser = argparse.ArgumentParser(
        "ros_tortoise",
        description="Generates tortoise-orm mixins boilerplate from ros messages",
    )
    parser.add_argument(
        "-o",
        "--output",
        required=True,
        metavar="DIRECTORY",
        help="output directory",
    )
    parser.add_argument(
        "packages",
        nargs="+",
        help="packages to generate",
    )

    args = parser.parse_args()
    packages = [
        k
        for k in ament_index_python.get_resources("rosidl_interfaces")
        if k in args.packages
    ]
    os.makedirs(args.output, exist_ok=True)
    sha1 = hashlib.sha1()
    for pkg in packages:
        pkg_spec = PackageSpec(pkg, parse_package(pkg))
        mixins = gen_mixin(pkg_spec)
        sha1.update(mixins.encode())
        outfile = f"{args.output}/{pkg}_mixins.py"
        with open(outfile, "w") as f:
            f.write(mixins)
        print(outfile)

    rev = base64.b32encode(sha1.digest())
    with open(f"{args.output}/rev", "bw") as f:
        f.write(rev)

    init_file = f"{args.output}/__init__.py"
    with open(f"{args.output}/__init__.py", "w") as f:
        f.write("")
    print(init_file)


if __name__ == "__main__":
    main()
