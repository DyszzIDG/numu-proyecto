FROM ruby:3-alpine

# Install dependencies (git to clone, and potentially others)
RUN apk add --no-cache git

# Clone WhatWeb official repository
RUN git clone https://github.com/urbanadventurer/WhatWeb.git /app

WORKDIR /app

# Ensure executable
RUN chmod +x whatweb

# Set entrypoint
ENTRYPOINT ["./whatweb"]

# Default command
CMD ["--help"]
