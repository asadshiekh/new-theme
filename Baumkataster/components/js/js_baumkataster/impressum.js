function toggleDropdown(sectionId) {
    const content = document.getElementById(sectionId);
    if (content.style.display === "block") {
        content.style.display = "none";
    } else {
        content.style.display = "block";
    }
}

// Function to toggle the dropdowns in Impressum page
function toggleImpressumSection(sectionId) {
    const section = document.getElementById(sectionId);
    const isExpanded = section.classList.contains('expanded');
    
    document.querySelectorAll('.impressum-section').forEach((el) => {
        el.classList.remove('expanded');
    });

    if (!isExpanded) {
        section.classList.add('expanded');
    }
}

$(document).ready(function() {
    $('#contact_form').bootstrapValidator({
        // To use feedback icons, ensure that you use Bootstrap v3.1.0 or later
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            vorname: {
                validators: {
                    stringLength: {
                        min: 2,
                    },
                    notEmpty: {
                        message: 'Bitte geben Sie Ihren Vornamen ein'
                    }
                }
            },
            nachname: {
                validators: {
                    stringLength: {
                        min: 2,
                    },
                    notEmpty: {
                        message: 'Bitte geben Sie Ihren Nachnamen ein'
                    }
                }
            },
            email: {
                validators: {
                    notEmpty: {
                        message: 'Bitte geben Sie Ihre E-Mail-Adresse ein'
                    },
                    emailAddress: {
                        message: 'Bitte geben Sie eine gültige E-Mail-Adresse ein'
                    }
                }
            },
            telefon: {
                validators: {
                    notEmpty: {
                        message: 'Bitte geben Sie Ihre Telefonnummer ein'
                    },
                    regexp: {
                        regexp: /^\+?[\d\s\-()]{7,20}$/,
                        message: 'Bitte geben Sie eine gültige Telefonnummer ein'
                    }
                }
            },
            adresse: {
                validators: {
                    stringLength: {
                        min: 8,
                    },
                    notEmpty: {
                        message: 'Bitte geben Sie Ihre Adresse ein'
                    }
                }
            },
            stadt: {
                validators: {
                    stringLength: {
                        min: 2,
                    },
                    notEmpty: {
                        message: 'Bitte geben Sie Ihre Stadt ein'
                    }
                }
            },
            bundesland: {
                validators: {
                    notEmpty: {
                        message: 'Bitte wählen Sie Ihr Bundesland aus'
                    }
                }
            },
            plz: {
                validators: {
                    notEmpty: {
                        message: 'Bitte geben Sie Ihre Postleitzahl ein'
                    },
                    regexp: {
                        regexp: /^\d{4}$/,
                        message: 'Bitte geben Sie eine gültige Postleitzahl ein'
                    }
                }
            },
            beschreibung: {
                validators: {
                    stringLength: {
                        min: 10,
                        max: 200,
                        message: 'Bitte geben Sie mindestens 10 Zeichen und nicht mehr als 200 ein'
                    },
                    notEmpty: {
                        message: 'Bitte geben Sie eine Projektbeschreibung ein'
                    }
                }
            }
        }
    })
    .on('success.form.bv', function(e) {
        $('#success_message').slideDown({ opacity: "show" }, "slow") // Show success message
        $('#contact_form').data('bootstrapValidator').resetForm();

        // Prevent form submission
        e.preventDefault();

        // Get the form instance
        var $form = $(e.target);

        // Get the BootstrapValidator instance
        var bv = $form.data('bootstrapValidator');

        // Use Ajax to submit form data
        $.post($form.attr('action'), $form.serialize(), function(result) {
            console.log(result);
        }, 'json');
    });
});
