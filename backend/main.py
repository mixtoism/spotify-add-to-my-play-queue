from typing import Annotated
from fastapi import FastAPI, Depends
from fastapi.responses import RedirectResponse
from redis import Redis
from fastapi_utils.tasks import repeat_every
import requests
import base64

app = FastAPI()


ACCEPTED_TOKEN = "2PspPTa*SzPUSWj2n-.v"
URL = "http://localhost:3000/"
CLIENT_ID = "ZZZZ"
CLIENT_SECRET = "XXXX"


def get_redis_connection() -> Redis:
    return Redis(host="localhost", port=6379, db=0)


@app.get("/")
def redirect_with_token(
    redis_client: Annotated[Redis, Depends(get_redis_connection)], token: str = None
):
    if token != ACCEPTED_TOKEN:
        return {"message": "Hello World"}
    auth_token = redis_client.get("auth_token")
    return RedirectResponse(URL + f"?creds={auth_token}")


def modify_auth_token(
    redis_client: Annotated[Redis, Depends(get_redis_connection)],
    refresh_token: str = None,
):
    if refresh_token is not None:
        redis_client.set("refresh_token", refresh_token)
    return {"message": "ok"}


@repeat_every(seconds=1)
def refresh_auth_token(redis_client: Annotated[Redis, Depends(get_redis_connection)]):
    refresh_token = redis_client.get("refresh_token")
    authorization_token = CLIENT_ID + ":" + CLIENT_SECRET
    authorization_token = base64.b64encode(authorization_token.encode("utf-8")).decode(
        "utf-8"
    )
    response = (
        requests.post(
            "https://accounts.spotify.com/api/token/",
            data={"grant_type": "refresh_token", "refresh_token": refresh_token},
            headers={
                "Authorization": f"Basic {authorization_token}",
                "Content-Type": "application/x-www-form-urlencoded",
            },
        ),
    )
    response = response.json()
    print(response.keys())
    redis_client.set("auth_token", response["access_token"])
