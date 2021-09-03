FROM node:12.14.1-alpine3.11 AS NPMBased
RUN apk update
RUN apk add --no-cache bash jq
WORKDIR /opt/airflow-notifier
COPY ./package.json /opt/airflow-notifier/package.json
COPY ./package-lock.json /opt/airflow-notifier/package-lock.json
ARG NPM_REGISTRY_PROXY=""
RUN npm set registry ${NPM_REGISTRY_PROXY} && npm i --production
RUN npm i --production --no-package-lock

FROM NPMBased
WORKDIR /opt/airflow-notifier
EXPOSE 80
ARG VERSION="latest"
RUN echo "{\"version\":\"$VERSION\"}" > image_version.json
ENV GOOGLE_APPLICATION_CREDENTIALS=/etc/secret/google-service.json
COPY . /opt/airflow-notifier
CMD ["npm", "start"]
