from django import forms

from .models import Report


# فرم گزارش تخلف
class ReportForm(forms.ModelForm):
    class Meta:
        model = Report
        fields = ["violation_type", "description"]