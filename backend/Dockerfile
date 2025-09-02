
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /app

COPY *.sln .
COPY Hypesoft.Domain/*.csproj ./Hypesoft.Domain/
COPY Hypesoft.Application/*.csproj ./Hypesoft.Application/
COPY Hypesoft.Infrastructure/*.csproj ./Hypesoft.Infrastructure/
COPY Hypesoft.API/*.csproj ./Hypesoft.API/

RUN for file in $(ls *.csproj); do dotnet restore $file; done

COPY . .
RUN dotnet publish Hypesoft.API/Hypesoft.API.csproj -c Release -o out

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app
COPY --from=build /app/out .
ENTRYPOINT ["dotnet", "Hypesoft.API.dll"]