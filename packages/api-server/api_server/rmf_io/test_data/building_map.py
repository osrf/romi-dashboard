import os.path

from building_map_msgs.msg import AffineImage, BuildingMap, Graph, Level


def make_building_map():
    with open(f"{os.path.dirname(__file__)}/office.png", "br") as f:
        image_data = f.read()

    return BuildingMap(
        name="test_name",
        levels=[
            Level(
                name="L1",
                elevation=0.0,
                images=[
                    AffineImage(
                        name="test_image",
                        x_offset=0.0,
                        y_offset=0.0,
                        yaw=0.0,
                        scale=1.0,
                        encoding="png",
                        data=image_data,
                    )
                ],
                places=[],
                doors=[],
                nav_graphs=[],
                wall_graph=Graph(name="test_graph", vertices=[], edges=[], params=[]),
            )
        ],
        lifts=[],
    )
