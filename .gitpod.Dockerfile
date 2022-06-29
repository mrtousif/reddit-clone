FROM gitpod/workspace-full

RUN npm i --location=global @nestjs/cli tsx serve fkill-cli

# Install kubectl, k3d, tilt
RUN brew install fzf navi git-secret kubectl kind starship dbmate

RUN kind create cluster

# RUN curl -fsSL https://raw.githubusercontent.com/tilt-dev/tilt/master/scripts/install.sh | bash