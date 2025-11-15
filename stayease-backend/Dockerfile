FROM eclipse-temurin:21-jdk

WORKDIR /app

# Copy Maven wrapper and pom.xml
COPY .mvn/ .mvn
COPY mvnw .
COPY pom.xml .

# Make mvnw executable and download dependencies
RUN chmod +x mvnw
RUN ./mvnw dependency:go-offline -B

# Copy source code
COPY src ./src

# Build the application
RUN ./mvnw clean package -DskipTests

EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "target/stayease-0.0.1-SNAPSHOT.jar"]