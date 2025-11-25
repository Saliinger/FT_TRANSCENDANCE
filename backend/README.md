src/
├── config/
│   ├── database.ts          # SQLite configuration
│   ├── blockchain.ts        # Avalanche/Solidity configuration
│   └── env.ts               # Environment variables
│
├── modules/
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.routes.ts
│   │   ├── auth.schema.ts
│   │   └── guards/
│   │       ├── jwt.guard.ts
│   │       └── 2fa.guard.ts
│   │
│   ├── users/
│   │   ├── user.controller.ts
│   │   ├── user.service.ts
│   │   ├── user.routes.ts
│   │   ├── user.schema.ts
│   │   └── user.model.ts
│   │
│   ├── game/
│   │   ├── game.controller.ts
│   │   ├── game.service.ts
│   │   ├── game.routes.ts
│   │   ├── game.schema.ts
│   │   └── websocket/
│   │       ├── game.gateway.ts
│   │       └── game.events.ts
│   │
│   ├── tournament/
│   │   ├── tournament.controller.ts
│   │   ├── tournament.service.ts
│   │   ├── tournament.routes.ts
│   │   └── tournament.schema.ts
│   │
│   └── blockchain/
│       ├── blockchain.controller.ts
│       ├── blockchain.service.ts
│       ├── blockchain.routes.ts
│       ├── contracts/
│       │   ├── TournamentScore.sol
│       │   └── deploy.ts
│       └── web3/
│           ├── client.ts
│           └── utils.ts
│
├── shared/
│   ├── plugins/
│   │   ├── cors.plugin.ts
│   │   ├── helmet.plugin.ts
│   │   ├── jwt.plugin.ts
│   │   └── websocket.plugin.ts
│   │
│   ├── middleware/
│   │   ├── error-handler.ts
│   │   ├── logger.ts
│   │   └── validation.ts
│   │
│   ├── utils/
│   │   ├── crypto.ts
│   │   ├── validation.ts
│   │   └── response.ts
│   │
│   └── types/
│       ├── express.d.ts
│       └── models.ts
│
├── database/
│   ├── migrations/
│   ├── seeds/
│   └── sqlite.client.ts
│
└── app.ts                   # Fastify app setup

server.ts                    # Entry point
docker-compose.yml
Dockerfile
.env.example
package.json
tsconfig.json