pipeline {
    agent {
        // this image provides everything needed to run Cypress
        // https://github.com/cypress-io/cypress-docker-images
        // https://jenkins.io/doc/book/pipeline/docker/
        docker {
            image "cypress/base:10"
        }
    }

    environment {
        // https://jenkins.io/doc/book/using/using-credentials/
        // https://support.cloudbees.com/hc/en-us/articles/203802500-Injecting-Secrets-into-Jenkins-Build-Jobs
        CYPRESS_RECORD_KEY = credentials('e3154325-d3a8-47cb-a950-ae3f78672558')
    }

    stages {
        stage("Testing node") {
            steps {
                sh "node --version"
            }
        }

        // first stage installs node dependencies and Cypress binary
        stage("Build") {
            steps {
                echo "Running build ${env.BUILD_ID} on ${env.JENKINS_URL}"
                sh "npm ci"
                sh "npm run cy:verify"
            }
        }

        stage("Start local server") {
            steps {
                // start local server in the background
                // we will shut it down in "post" command block
                sh "nohup npm start &"
            }
        }

        // this tage runs end-to-end tests, and each agent uses the workspace
        // from the previous stage
        stage("Testing react") {
            steps {
                echo "Running build ${env.BUILD_ID}"
                sh "npm run cypress:react-test"
            }
        }
    }

    // https://jenkins.io/doc/pipeline/tour/post/
    post {
        // shutdown the server running in the background
        always {
            echo "Stopping local server"
            // kills process matching regex on name
            // node('master') {
            //     sh "pkill -f node"
            // }
        }
    }
}
