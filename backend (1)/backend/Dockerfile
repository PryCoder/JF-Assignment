<<<<<<< HEAD
=======

>>>>>>> cc76bcf4600b147f643241340bec19629df74979
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

<<<<<<< HEAD
=======

>>>>>>> cc76bcf4600b147f643241340bec19629df74979
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
<<<<<<< HEAD
CMD ["java", "-jar", "app.jar"]
=======
ENTRYPOINT ["java", "-jar", "app.jar"]
>>>>>>> cc76bcf4600b147f643241340bec19629df74979
