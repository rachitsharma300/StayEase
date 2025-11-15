FROM eclipse-temurin:21-jdk

WORKDIR /app

COPY .mvn/ .mvn
COPY mvnw .
COPY pom.xml .

RUN chmod +x mvnw
RUN ./mvnw dependency:go-offline

COPY src ./src

# Build jar
RUN ./mvnw clean package spring-boot:repackage -DskipTests

EXPOSE 8080

# run any jar inside target
ENTRYPOINT ["sh", "-c", "java -jar $(ls target/*.jar)"]