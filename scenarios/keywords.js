exports.settings = {
    'text': 'Select some keywords',
    'attachments': [
        {
            'fallback': 'Something is wrong with me. Please contact a human :(',
            'callback_id': 'keywords',
            'color': '#3AA3E3',
            'attachment_type': 'default',
            'actions': [
                {
                    'name': 'menu',
                    'text': 'Select keywords',
                    'type': 'select',
                    'options': [],
                    'value': JSON.stringify({
                        next: 'menu',
                        method: 'searchByKeywords'
                    })
                },
            ]
        }
    ]
};

