from tortoise import fields, models


class Robot(models.Model):
    name = fields.CharField(max_length=100)
    model = fields.CharField(max_length=100, null=True)


class Fleet(models.Model):
    name = fields.CharField(max_length=100)
