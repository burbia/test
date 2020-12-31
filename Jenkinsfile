#!groovy​

@Library("jenkins-global-library@release/0.9.x") _

import com.roche.pfdevops.build.*
import com.roche.pfdevops.scm.*
import com.roche.pfdevops.common.*
import com.roche.pfdevops.common.utils.*

String imageBuildName = "docker.repository.kiosk.roche.com/pf-devops/jenkins-build-agent"
String imageBuildVersion = "1.0.2-master"
devopsPipeline(branchModel: branching.ModelType.FREE_RELEASE) {
    catchError {
		Builder npmBuilder

        stageCheckout(stashLabel: "checkout-scm") {
            //post checkout.scm
        }
        nodeNpm(imageName:imageBuildName, version: imageBuildVersion) {
            stage("Configure") {
				npmBuilder = PipelineContext.instance.factory.newNpmBuilder(PipelineContext.instance.scmBranchModel);
            }	

			stage("Build") {
				npmBuilder.execute("run build")
			}

			if(env.BRANCH_NAME == "master"){
				stageThrowsOnBuildStatusFailure("Test"){
					npmBuilder.execute("run test:coverage")
				}

				stage('SonarQube analysis'){
					withSonarQubeEnv('sonarFoundations') {
						npmBuilder.execute("run sonar")
					}
				}

				stage("Quality Gate"){
					timeout(time: 20, unit: 'MINUTES') {
						// Just in case something goes wrong, pipeline will be killed after a timeout
						def qg = waitForQualityGate() // Reuse taskId previously collected by withSonarQubeEnv
						if (qg.status == 'ERROR') {
							currentBuild.result = 'UNSTABLE' // of FAILURE
							//error "Pipeline aborted due to quality gate failure: ${qg.status}"
						}
					}
				}
			} 
			else {
				stageThrowsOnBuildStatusFailure("Test"){
					npmBuilder.execute("run test")
				}

			}
			
			stage("Docker Build") {
				npmBuilder.execute("run docker:build")
			}
			stage("Docker publish"){
			    npmBuilder.publish(dockerImages:["infinity/pm-dashboard-frontend:${npmBuilder.version}"])
			}
        }

    executeIfBuildStatusNotSuccess
    {
        PipelineContext.instance.factory.newEmail().send()
    }

}
}