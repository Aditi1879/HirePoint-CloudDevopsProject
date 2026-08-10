# HirePoint Rollback Procedure

## Purpose

This document describes the procedure for rolling back the HirePoint application if a production deployment introduces errors or unexpected behavior.

## Deployment Architecture

HirePoint uses the following deployment flow:

GitHub → GitHub Actions → Docker Hub → Render

GitHub Actions performs automated testing, linting, frontend builds, Docker image builds, and publishes the Docker images to Docker Hub. A Render Deploy Hook then triggers the Render deployment.

## Rollback Strategy

The application can be rolled back by redeploying a previously known-good Docker image or by reverting the Git repository to a previously working commit and triggering the CI/CD pipeline again.

### Method 1 — Roll back using a previous Git commit

1. Identify the last known-good commit in the GitHub repository.
2. Verify that the commit corresponds to a previously working version of the application.
3. Revert the problematic changes in the local repository.
4. Run the normal tests and build checks.
5. Commit the rollback change.
6. Push the rollback commit to the `main` branch.
7. GitHub Actions automatically runs the CI/CD pipeline.
8. If all checks pass, the Docker images are published to Docker Hub.
9. The Render Deploy Hook triggers a new deployment.
10. Verify the application health using the `/health` endpoint.
11. Verify that UptimeRobot reports the service as healthy.

### Method 2 — Roll back to a previously known-good Docker image

If a previously published Docker image is available, the Render service can be configured to use the known-good image version.

The preferred approach is to use a version-specific Docker image tag rather than relying only on the `latest` tag.

After selecting the known-good image:

1. Update the Render image configuration to the known-good image tag.
2. Deploy the service from the known-good image.
3. Verify the `/health` endpoint.
4. Confirm that UptimeRobot reports the service as healthy.
5. Monitor the application for errors after the rollback.

## Verification After Rollback

After completing a rollback, verify:

- Backend service is running on Render.
- `/health` returns a successful response.
- Frontend is accessible.
- API requests work correctly.
- UptimeRobot reports the service as up.
- No new deployment errors are reported by Render.
- GitHub Actions remains green for subsequent changes.

## Rollback Safety

Production rollback should use a previously verified working version. The existing deployment should not be intentionally broken during normal rollback testing.

The rollback process should be performed only when a deployment causes production issues or when a previous stable version is required.