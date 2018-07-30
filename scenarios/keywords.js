exports.settings = {
    'text': 'Select a keyword',
    'attachments': [
        {
            'fallback': 'Something is wrong with me. Please contact a human :(',
            'callback_id': 'keywords',
            'attachment_type': 'default',
            'actions': [
                {
                    'name': 'keywords',
                    'text': 'Select keywords',
                    'type': 'select',
                    'options': [],
                },
            ],
            'color': '#90dfaa'
        }
    ]
};

