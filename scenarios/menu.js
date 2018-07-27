exports.settings = {
    'attachments': [
        {
            'fallback': 'Something is wrong with me. Please contact a human :(',
            'callback_id': 'menu',
            'color': '#3AA3E3',
            'attachment_type': 'default',
            'actions': [
                {
                    'name': 'menu',
                    'text': 'Yes',
                    'type': 'button',
                    'style': 'primary',
                    'value': JSON.stringify({
                        next: 'keywords',
                        method: 'goToNextStep'
                    })
                },
            ]
        }
    ]
};
