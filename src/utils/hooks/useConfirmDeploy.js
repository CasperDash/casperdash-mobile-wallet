import {useState} from 'react';
import useSigner from './useSigner';
import {apis} from 'services';
import {MessageType} from 'components/CMessge/types';

export const useConfirmDeploy = () => {
    const [isDeploying, setIsDeploying] = useState(false);
    const [isError, setDeployError] = useState(false);

    const signer = useSigner();

    const putSignedDeploy = (signedDeploy, cb) => {
        try {
            const data = apis.deployAPI(signedDeploy);
            if (data){
                return data.deployHash;
            }
            return null;
        } catch (e) {
            throw e;
        }
    };

    const executeDeploy = async (buildDeployFn, fromPublicKey, toPublicKey, showMessage) => {
        setIsDeploying(true);
        showMessage('Preparing deploy');
        try {
            const deploy = await buildDeployFn();
            // Sign with signer
            showMessage('Please review the deploy');
            const signedDeploy = await signer.sign(deploy, fromPublicKey, toPublicKey);
            showMessage('Putting deploy');

            const deployHash = await putSignedDeploy(signedDeploy);
            showMessage(`Deploy hash: ${deployHash}`, MessageType.success);
            setIsDeploying(false);
            return { deployHash, signedDeploy };

        } catch (error) {
            showMessage(error.message, MessageType.error);
            setDeployError(true);
            setIsDeploying(false);
            console.error(error);
            return {};
        }
    };

    return {executeDeploy, isDeploying, isError};
};
