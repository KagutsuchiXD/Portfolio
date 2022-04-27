from django.db import models


class ConvFactor(models.Model):
    lbs_to_t_oz = models.DecimalField(default=14.5833, max_digits=6, decimal_places=4)  # Conversion factors found
    t_oz_to_lbs = models.DecimalField(default=0.06857, max_digits=6, decimal_places=6)  # on google.com

