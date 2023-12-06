### Project presentation
https://youtu.be/K9GL8jj7N9k

### The project is divided into 4 parts

- Part 1: Serverless functions for log ingestion and querying. Chosen serverless functions because of the low cost of running them and the ease of scaling them. 
- Part 2: Database layer for caching connections to mitigate exhaustion of database connections. Chosen because each invocation of the serverless function will create a new connection to the database.
- Part 3: Queueing system for asynchronous processing of data. Chosen to enable bulk processing of data and to prevent the serverless function from timing out.
- Part 4: Web UI for querying logs. Chosen to enable users to query logs without having to write code.

The serverless functions are front-facing - they intercept http requests both for ingestion and querying.
The database layer and queueing system are internal - they are not exposed to the user.

### Architecture

Ingestion request (from various sources) ---> Serverless function ---> Queueing system ---> Database layer ---> Database. \
Querying request (from web ui) ---> Serverless function ---> Database layer ---> Database ---> Database layer ---> Serverless function ---> Web ui.

### Features implemented:

- bulk processing as well as single processing
- query by specific date range
- query by any one or all field

  - level
  - message
  - resourceId
  - timestamp
  - traceId
  - spanId
  - commit
  - metadata.parentResourceId
- advanced search by any combination of fields and applying condition on each field (equal, not equal, contains, not contains)

### Prerequisites

- Node.js latest
- npm latest
- mongodb running locally
- zeplo cli installed globally: `npm install -g @zeplo/cli`
- netlify cli installed globally: `npm install -g netlify-cli`

### Running locally

- in a different terminal run `zeplo dev` to start the queueing system
- in a different terminal `cd` into `db` folder and run `npm install` to install dependencies
- run `npm run build && DEV=true SECRET_KEY=secret SERVER_PORT=8000 npm run start` to start the database layer
- in a different terminal cd into `logs` folder and run `npm install` to install dependencies
- run `netlify dev -p 3000` to start the serverless functions
- in a different terminal cd into `web-ui` folder and run `npm install` to install dependencies
- run `PORT=3001 REACT_APP_API_URL=http://localhost:3000 npm start` to start the web ui.

### Comments

While a proper cloud provider such as AWS or GCP would be ideal for this project, I chose:

- Netlify for serverless functions
- Zeplo for queueing system
- MongoDB Atlas for database layer
- Netlify for web ui
- Cyclic.sh for database layer

for the following reasons:

- ease of setup
- ease of deployment
- free tier

Setting up a proper cloud environment with best security practices would take a lot of time and effort. I chose to focus on the core functionality of the project instead. Although the queueing system and database layer is open to the internet, I have made sure that only the serverless functions have access to them. In a proper cloud environment, I would have used a VPC to restrict access to the queueing system and database layer.

You can track the progress of the project here:

- Serverless functions: https://github.com/tirthajyoti-ghosh/log-ingestor-service/commits/main
- Database layer: https://github.com/tirthajyoti-ghosh/log-ingestor-db-layer/commits/main
- Web UI: https://github.com/tirthajyoti-ghosh/log-query-web-ui/commits/main

### Potentials improvements

- Using serverless functions means cold start time. A warmup function can be used to mitigate this.
- A proper log parser is absent from this implementation. 
- Having a proper log parser would enable us to determine which fields should be indexed in the database with confidence which is also absent from this implementation.
- A proper cloud environment with best security practices.
- A better search capability. Elasticsearch would be a good choice.
