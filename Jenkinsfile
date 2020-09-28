@Library('common-lib@1.7') _
pipeline {
  agent any;
  environment {
    DOCKER_REPO = 'yadev/storeme'
  }
  parameters {
    string(name: 'DOCKER_TAG', defaultValue: "")
    booleanParam(name: 'PRODUCTION_BUILD', defaultValue: false, description: 'Deploy to Production')
  }
  stages {
    stage('Dev Build') {
      when {
        not {
          anyOf {
            branch 'master'
            buildingTag()
            expression {
              return params.PRODUCTION_BUILD
            }
          }
        }
      }
      steps {
        script {
          def dockerTag = params.DOCKER_TAG;
          if (dockerTag.trim().equals("")) {
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
    stage('Prod Build') {
      when {
        anyOf {
          branch 'master'
          buildingTag()
          expression {
            return params.PRODUCTION_BUILD
          }
        }
      }
      steps {
        script {
          def dockerTag = params.DOCKER_TAG;
          if (dockerTag.trim().equals("")) {
            dockerTag = env.BRANCH_NAME;
          }

          def tags = [];
          tags << dockerTag;

          def buildArgs = [];
          buildArgs << "BUILD_ENV=prod"

          dockerBuild(repo: env.DOCKER_REPO, tags: tags, buildArgs: buildArgs);
          dockerLogin(creds: 'hub-docker');
          dockerPush();
          dockerLogout();
          dockerClean();
        }
      }
    }
    stage('Deploy to Dev K8S') {
      when {
        not {
          anyOf {
            branch 'master'
            buildingTag()
            expression {
              return params.PRODUCTION_BUILD
            }
          }
        }
      }
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
    stage('Deploy to Prod K8S') {
      when {
        anyOf {
          branch 'master'
          buildingTag()
          expression {
            return params.PRODUCTION_BUILD
          }
        }
      }
      steps {
        script {
          deployToKube(
            namespace: 'prod-storeme',
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
