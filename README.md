# essential-photo

test jira connection

# Contributing

There are two ways to get started. You can easily get started using a code space using the custom devcontainer defined for this project, or you can get start using local docker containers compose if you have the env for it.

## Codespace:

Build a codespace from the Code:Codespace menu in the repo UI and wait for it to build the vm. 

Once you have a built space, you can start the app using the dev script:

```bash
dev-scripts/start_codespace_app.sh 
```

## Local docker compose

```bash
docker-compose build
```

Output debugging:

```bash
docker-compose build --progress=plain
```

Cleaning build (discard cache):

```bash
docker-compose build --no-cache
```

Start the application and services:

```bash
docker-compose up
```
