pipeline {
    agent any

    options {
        disableConcurrentBuilds()
        timeout(time: 20, unit: 'MINUTES')
    }

    stages {
        stage('Build & Push') {
            steps {
                sh 'docker build -t localhost:5000/homepage:latest .'
                sh 'docker push localhost:5000/homepage:latest'
            }
        }

        stage('Deploy') {
            when {
                branch 'main'
            }
            steps {
                sh 'kubectl rollout restart deployment/homepage -n homepage'
                sh 'kubectl rollout status deployment/homepage -n homepage --timeout=120s'
            }
        }
    }
}
