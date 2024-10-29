#!/bin/bash
set -e

# Create database and user
mongosh <<EOF
use ${MONGO_INITDB_DATABASE}
db.createUser({
    user: "${MONGO_INITDB_USERNAME}",
    pwd: "${MONGO_INITDB_PASSWORD}",
    roles: [{
        role: "readWrite",
        db: "${MONGO_INITDB_DATABASE}"
    }]
})
EOF

# Import initial data
mongoimport --db ${MONGO_INITDB_DATABASE} --collection user --file /docker-entrypoint-initdb.d/data/user.json --jsonArray
mongoimport --db ${MONGO_INITDB_DATABASE} --collection recipes --file /docker-entrypoint-initdb.d/data/recipes.json --jsonArray