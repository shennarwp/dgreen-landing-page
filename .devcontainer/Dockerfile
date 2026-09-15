# Extends the stock base dev image with the OpenCode CLI baked in, so agent
# work inside the container matches the host. Auth is mounted read-only at
# creation (see devcontainer.json) so nothing secret is baked into the image.
FROM mcr.microsoft.com/devcontainers/base:bookworm

USER vscode
RUN export HOME=/home/vscode \
    && mkdir -p $HOME/.local/share/opencode \
    && curl -fsSL -o /tmp/opencode-install.sh https://opencode.ai/install \
    && bash /tmp/opencode-install.sh \
    && rm /tmp/opencode-install.sh \
    && test -x $HOME/.opencode/bin/opencode
ENV PATH="/home/vscode/.opencode/bin:${PATH}"
