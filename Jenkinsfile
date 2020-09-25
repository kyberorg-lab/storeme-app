@Library('common-lib@1.7') _
pipeline {
    agent any;
    environment {
           DOCKER_REPO = 'yadev/storeme'
    }
    parameters {
       string(name: 'DOCKER_TAG', defaultValue: "")
    }
    stages {
        stage('Docker') {
            steps {
                script {
                    def dockerTag = params.DOCKER_TAG;
                    if(dockerTag.trim().equals("")) {
                       dockerTag = env.BRANCH_NAME;
                    }

                    def tags = [];
                    tags << dockerTag;

                    def buildArgs = [];
                    buildArgs << "BUILD_ENV=dev"

                    dockerBuild(repo: env.DOCKER_REPO, tags: tags, buildArgs: buildArgs);
                    dockerLogin(creds: 'hub-docker');
                    dockerPush();
                    dockerLogout();
                    dockerClean();
                }
            }
        }
        stage('Deploy to K8S') {
            steps {
                script {
                    deployToKube(
                       namespace: 'dev-storeme',
                       workloadName: 'storeme-app',
                       imageRepo: env.DOCKER_REPO,
                       imageTag: env.BRANCH_NAME
                    )
                }
            }
        }
    }
    post {
        always {
            cleanWs();
        }
    }
}
