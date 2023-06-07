import { useState } from 'react';
import useSigner from './useSigner';
import { IPutDeployRequest, putDeploy } from 'services/Deploy/deployApis';
import { MessageType } from 'components/CMessge/types';

export const useConfirmDeploy = () => {
  const [isDeploying, setIsDeploying] = useState(false);
  const [isError, setDeployError] = useState(false);

  const signer = useSigner();

  /**
   * It takes a signed deploy and sends it to the deploy API
   * @param signedDeploy - The signed deploy that you want to deploy.
   * @param cb - callback function that will be called with the result of the deploy.
   * @returns The deployHash.
   */
  const putSignedDeploy = async (signedDeploy: IPutDeployRequest) => {
    try {
      const data = await putDeploy(signedDeploy);
      if (data?.deployHash) {
        return data.deployHash;
      }
      return null;
    } catch (e) {
      throw e;
    }
  };

  /**
   * It builds a deploy, signs it with the signer, and puts it on-chain
   * @param buildDeployFn - A function that returns a deploy.
   * @param fromPublicKey - The public key of the account that is sending the deploy.
   * @param toPublicKey - The public key of the account that will receive the deploy.
   * @param showMessage - a function that takes a message and a message type and displays it to the
   * user.
   * @returns The deploy hash and the signed deploy.
   */
  const executeDeploy = async (buildDeployFn: any, fromPublicKey: string, showMessage: any) => {
    setIsDeploying(true);
    showMessage('Preparing deploy');
    try {
      const deploy = await buildDeployFn();
      // Sign with signer
      showMessage('Please review the deploy');
      const signedDeploy = await signer.sign(deploy, fromPublicKey);
      showMessage('Putting deploy');

      const deployHash = await putSignedDeploy(signedDeploy);
      showMessage(`Deploy hash: ${deployHash}`, MessageType.success);
      setIsDeploying(false);
      return { deployHash, signedDeploy };
    } catch (error: any) {
      showMessage(error.message, MessageType.error);
      setDeployError(true);
      setIsDeploying(false);

      return {};
    }
  };

  return { executeDeploy, isDeploying, isError };
};
