FROM gitpod/workspace-full

RUN npm i --location=global @nestjs/cli tsx serve kill-port

# Install kubectl, k3d, tilt
RUN brew install fzf git-secret kubectl k3d

# RUN k3d cluster create gitpod

# RUN curl -fsSL https://raw.githubusercontent.com/tilt-dev/tilt/master/scripts/install.sh | bash