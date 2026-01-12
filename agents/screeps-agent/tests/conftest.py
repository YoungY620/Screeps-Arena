"""Pytest configuration and fixtures for screeps-agent tests."""

import pytest
import asyncio
from screeps_agent.screeps_client import ScreepsClient, ScreepsCLI, ScreepsAPI, AccountConfig


# Server configuration (assuming local server is running)
SERVER_URL = "http://localhost:21025"
CLI_PORT = 21026


@pytest.fixture
def event_loop():
    """Create an instance of the default event loop for each test case."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture
def cli():
    """Create a ScreepsCLI instance."""
    return ScreepsCLI(host="localhost", port=CLI_PORT)


@pytest.fixture
def kimi_account():
    """Create account config for kimi user."""
    return AccountConfig(username="kimi", password="kimi123")


@pytest.fixture
def kimi_client(kimi_account):
    """Create a ScreepsClient for kimi user."""
    return ScreepsClient(
        server_url=SERVER_URL,
        cli_port=CLI_PORT,
        account=kimi_account,
    )


@pytest.fixture
def kimi_api(kimi_account):
    """Create a ScreepsAPI for kimi user."""
    return ScreepsAPI(SERVER_URL, kimi_account)
