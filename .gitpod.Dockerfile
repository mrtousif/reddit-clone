FROM gitpod/workspace-full

# Install kubectl, k3d, tilt
RUN brew install kubectl k3d

RUN k3d cluster create gitpod

RUN curl -fsSL https://raw.githubusercontent.com/tilt-dev/tilt/master/scripts/install.sh | bash