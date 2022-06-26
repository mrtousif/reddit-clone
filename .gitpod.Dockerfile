FROM gitpod/workspace-full

RUN pnpm add -g @nestjs/cli nodemon serve kill-port

# Install kubectl, k3d, tilt
RUN brew install fzf kubectl

RUN brew install k3d

# RUN k3d cluster create gitpod

# RUN curl -fsSL https://raw.githubusercontent.com/tilt-dev/tilt/master/scripts/install.sh | bash