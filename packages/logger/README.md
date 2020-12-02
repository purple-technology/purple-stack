![Purple Stack Title Image](https://user-images.githubusercontent.com/6282843/99382243-8a14f200-28cc-11eb-99b1-114f4842874b.png)

# @package/logger

This package serves for simplifying structured logging within Lambda functions.

Structured logging logs JSON containing relevant metadata instead of logging just a simple string.

Logging the context metadata is quite important in such a distributed system like Lambda functions are.

This helps developers to search in the logs for a specific log and gives them proper context of what happened to who.

## Examlpe

Lambda function handler:
```typescript
import { logWarn, LogError } from '@package/logger' 

export const handler = (event) => {
    if (event.name.length === 0) {
        logWarn('empty_name', { event })
    }

    if (typeof event.disabled === 'undefined') {
        throw new LogError('disabled_is_undefined', { event })
    }
}
```

Logs inside CloudWatch:
```json
{
    "level": "warn",
    "title": "empty_name",
    "data": {
        "event": {
            "name": "",
            "age": 21,
            "nationality": "Czech"
        }
    }
}
{
    "level": "error",
    "title": "disabled_is_undefined",
    "data": {
        "event": {
            "name": "Filip",
            "age": 21,
            "nationality": "Czech"
        }
    }
}
```

## Searching for the logs
When the logs are structured we can then easily search in them by differnet fields.

Example of CloudWatch Insights query:
```
fields level, name, data
| filter name = "empty_name" and data.event.age > 20
```

```
fields level, name, data
| filter name = "disabled_is_undefined"
```
