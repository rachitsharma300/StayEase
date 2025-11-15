FROM eclipse-temurin:21-jdk

WORKDIR /app

COPY pom.xml .
COPY src ./src

# Install Maven and build
RUN apt-get update && apt-get install -y maven
RUN mvn clean package -DskipTests

EXPOSE 8080

# Environment variables pass karo
CMD ["java", "-jar", "target/stayease-0.0.1-SNAPSHOT.jar", "--spring.datasource.url=${JDBC_DATABASE_URL}?sslmode=require", "--spring.datasource.username=${JDBC_DATABASE_USERNAME}", "--spring.datasource.password=${JDBC_DATABASE_PASSWORD}", "--stayease.jwt.secret=${JWT_SECRET}", "--razorpay.key.id=${RAZORPAY_KEY_ID}", "--razorpay.key.secret=${RAZORPAY_KEY_SECRET}"]
