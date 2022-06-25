FROM gitpod/workspace-full

# Install kubectl, k3d, tilt
RUN brew install kubectl

RUN curl -sfL https://get.k3s.io | sh -

RUN sudo k3s server

RUN curl -fsSL https://raw.githubusercontent.com/tilt-dev/tilt/master/scripts/install.sh | bash