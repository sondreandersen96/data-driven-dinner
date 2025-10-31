# Data Driven Dinner

Run docker compose:


Build backend: (for now this must be done as separate step, ideally part of dockerfile)
```
cd recipe-service && ./mvnw package && cd .. && docker compose down && docker compose up --build
```


ENVs:

`OIDC_CLIENT_SECRET=xxx`


