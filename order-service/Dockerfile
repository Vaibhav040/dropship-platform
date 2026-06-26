# Stage - 1
FROM maven:3.9.6-eclipse-temurin-17-alpine AS builder
WORKDIR /build
COPY pom.xml .

RUN mvn dependency:go-offline
COPY src ./src
RUN mvn clean package -DskipTests

# Stage - 2
FROM eclipse-temurin:17-jre-alpine
RUN apk update && apk upgrade --no-cache
WORKDIR /app

RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring
COPY --from=builder /build/target/*.jar /app/

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]