.PHONY: sonar-scan
sonar-scan: ## - execute sonar scan
	@ sonar-scanner -D sonar.projectKey="aastra" \
                    -D sonar.projectName="aastra" \
                    -D sonar.scm.provider=git \
                    -D sonar.sources=. \
                    -D sonar.exclusions="coverage/**,audit/**,docs/**" \
                    -D sonar.host.url="https://sonar.cicd.brahma.fi" \
                    -D sonar.github.repository='https://github.com/Brahma-fi/aastra' \
                    -D sonar.token="$(sonarToken)"
