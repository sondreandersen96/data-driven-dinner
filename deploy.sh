set -e

echo "Pulling latest code"
git pull

cd recipe-service

echo "Building application..."
./mvnw clean package -DskipTests

echo "Application build complete"

cd ..

echo "Starting containers with Docker Compose"
docker compose up --build -d

echo "Deployment complete! 🚀"


