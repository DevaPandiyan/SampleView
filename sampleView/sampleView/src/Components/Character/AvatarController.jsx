import { useGLTF,useAnimations, Capsule, PerspectiveCamera } from '@react-three/drei';
import { useFrame, useGraph } from '@react-three/fiber';
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { AnimationMixer, PropertyBinding, Vector3 } from 'three';
import { OrbitControls, SkeletonUtils } from 'three-stdlib';
import  newKeyBoard  from './newKeyBoard';
import * as THREE from 'three';
import { CapsuleCollider, RigidBody, euler, quat, vec3 } from '@react-three/rapier';

const MOVEMENT_SPEED = 0.2;
const JUMP_FORCE = 0.0;
const MAX_VEL =5;
const WALK_VEL =3

export const AvatarController = ({avatarUrl}) => {
    const group =useRef();
    //Movement
  
    // const {scene} =useGLTF(avatarUrl);
    const {scene} =useGLTF(avatarUrl);
    const avatar =useRef()
    // console.log("scence",scene)
    const  clone =useMemo(()=>SkeletonUtils.clone(scene),[scene]);
    // const {nodes} =useGraph(clone);
    const {animations:walkAnimation} =useGLTF("/models/animations/M_Walk_001.glb");
    const {animations:danceAnimation} =useGLTF("/models/animations/M_Dances_001.glb");
    const {animations:idleAnimation} =useGLTF("/models/animations/M_Standing_Idle_002.glb");
    const {animations:runAnimation} =useGLTF("/models/animations/M_Run_001.glb");
    const {animations:jumpAnimation} =useGLTF("/models/animations/M_Jog_Jump_002.glb");
    const {animations:standing1AnimationExpression} =useGLTF("/models/animations/M_Standing_Expressions_005.glb");
    const {animations:standing2AnimationExpression} =useGLTF("/models/animations/M_Standing_Expressions_001.glb");
    const {animations:standing3AnimationExpression} =useGLTF("/models/animations/M_Standing_Expressions_006.glb");
    const {animations:talkingAnimation} =useGLTF("/models/animations/M_Talking_Variations_001.glb");

  
    const [animation, setAnimation] = useState();
    const newactions =useMemo(()=>[],[])
    const mixer =useMemo(()=>new AnimationMixer(),[])
    const keyboard=newKeyBoard();
    let [wait, setWait] = useState(false)
    let actionAssigned=false;



    const rb= useRef();
    const isOnFloor = useRef(false);
    const camera =useRef();
    const cameraTarget =useRef(new Vector3(0,0,0));





    useEffect(() => {
        newactions['idle'] = mixer.clipAction(idleAnimation[0],avatar.current);
        newactions['walk'] = mixer.clipAction(walkAnimation[0],avatar.current);
        newactions['run'] = mixer.clipAction(runAnimation[0],avatar.current);
        newactions['jump'] = mixer.clipAction(jumpAnimation[0],avatar.current);
        newactions['dance'] = mixer.clipAction(danceAnimation[0],avatar.current);
        newactions['expression1'] = mixer.clipAction(standing1AnimationExpression[0],avatar.current);
        newactions['expression2'] = mixer.clipAction(standing2AnimationExpression[0],avatar.current);
        newactions['expression3'] = mixer.clipAction(standing3AnimationExpression[0],avatar.current);
        newactions['talking'] = mixer.clipAction(talkingAnimation[0],avatar.current);  
        newactions['idle'].play();
      });

    useEffect(() => {
        animation?.reset().fadeIn(0.32).play()
        return () => {
            animation?.fadeOut(0.32)
        }
    }, [animation])

    useFrame(() => {
      // Accessing the "Hips" object once the component mounts
      const hips = avatar.current.getObjectByName("Hips");
      if (hips) {
        hips.position.set(0, hips.position.y, 0);
        // hips.rotation.set(0, 2, 0);
        // console.log(avatar.current)
      }
     
     
    }, [avatar, scene]);


    useFrame((state,delta)=>{
      // cameraTarget.current.lerp(vec3(rb.current.translation()),1.5);
      // camera.current.lookAt(cameraTarget.current);

        const impulse = { x: 0, y: 0, z: 0 };

        if(keyboard['Space'] && !isOnFloor.current){
            impulse.y += JUMP_FORCE;
            isOnFloor.current = true;
            // console.log(impulse.y)
          }else{
            impulse.y=0;
          }


        const linvel =rb.current.linvel();
        let changeRotation =false;
        if((keyboard['KeyD'] || keyboard['ArrowRight']) && linvel.x < WALK_VEL){
            impulse.x += MOVEMENT_SPEED;
            changeRotation =true;
          }
          if((keyboard['KeyA']|| keyboard['ArrowLeft']) && linvel.x > -WALK_VEL){
            impulse.x -= MOVEMENT_SPEED;
            changeRotation =true;
          }
          if((keyboard['KeyS'] || keyboard['ArrowDown']) && linvel.z < WALK_VEL){
            
            impulse.z += MOVEMENT_SPEED;
            changeRotation =true;
          }

        if( ( keyboard['KeyW'] ||keyboard['ArrowUp']) &&  linvel.z > -WALK_VEL){
            impulse.z -= MOVEMENT_SPEED;
            changeRotation =true;
          }

          if( (( keyboard['KeyW'] ||keyboard['ArrowUp']) && keyboard["ShiftLeft"])   &&  linvel.z > -MAX_VEL){
            impulse.z -= MOVEMENT_SPEED+0.3;
            changeRotation =true;
          }

          if( (( keyboard['KeyS'] || keyboard['ArrowDown']) && keyboard["ShiftLeft"])   &&  linvel.z < MAX_VEL){
            impulse.z += MOVEMENT_SPEED+0.3;
            changeRotation =true;
          }

          rb.current.applyImpulse(impulse,true);


          if (changeRotation) {
            const angle = Math.atan2(linvel.x, linvel.z);
            avatar.current.rotation.y = angle;
          }


          const characterWorldPosition = avatar.current.getWorldPosition(
            new THREE.Vector3()
          );

          state.camera.position.x = characterWorldPosition.x;
          state.camera.position.z = characterWorldPosition.z + 3;
          state.camera.position.y = characterWorldPosition.y + 2;
      
          const targetLookAt = new THREE.Vector3(
            characterWorldPosition.x,
            characterWorldPosition.y,
            characterWorldPosition.z
          );
      
          state.camera.lookAt(targetLookAt);

    })
  
     

      useFrame((_,delta)=>{
        if (!wait) {
          actionAssigned = false
          if(keyboard['KeyW']|| keyboard['ArrowUp']){
            setAnimation(newactions['walk'])
            actionAssigned = true
          }
          if(keyboard['KeyS']|| keyboard['ArrowDown']){
            setAnimation(newactions['walk'])
            actionAssigned = true
          }
          if(keyboard['KeyA']|| keyboard['ArrowLeft']){
            setAnimation(newactions['walk'])
            actionAssigned = true
          }
          if(keyboard['KeyD']|| keyboard['ArrowRight']){
            setAnimation(newactions['walk'])
            actionAssigned = true
          }
          if((keyboard['KeyW'] || keyboard['ArrowUp']) && keyboard["ShiftLeft"]){
            setAnimation(newactions['run'])
            actionAssigned = true
          }
          if((keyboard['KeyS'] || keyboard['ArrowDown']) && keyboard["ShiftLeft"]){
            setAnimation(newactions['run'])
            actionAssigned = true
          }
          if((keyboard['KeyA'] || keyboard['ArrowLeft']) && keyboard["ShiftLeft"]){
            setAnimation(newactions['run'])
            actionAssigned = true
          }
          if((keyboard['KeyD'] || keyboard['ArrowRight']) && keyboard["ShiftLeft"]){
            setAnimation(newactions['run'])
            actionAssigned = true
          }



          if(keyboard['Space'] ){
            setAnimation(newactions['jump'])
            actionAssigned = true
          }
          if(keyboard['KeyF'] ){
            setAnimation(newactions['dance'])
            actionAssigned = true
          }
          if(keyboard['KeyG'] ){
            setAnimation(newactions['expression1'])
            actionAssigned = true
          }
          if(keyboard['KeyQ'] ){
            setAnimation(newactions['expression2'])
            actionAssigned = true
          }
          if(keyboard['KeyE'] ){
            setAnimation(newactions['expression3'])
            actionAssigned = true
          }
          if(keyboard['KeyT'] ){
            setAnimation(newactions['talking'])
            actionAssigned = true
          }
        }
        !actionAssigned && (setAnimation(newactions['idle']))
        mixer.update(delta)
      })

  return (
    <group>
    <RigidBody ref={rb} name='Player'  friction={0} restitution={1}  position={[0,-0.6,0]} gravityScale={3.5} enabledRotations={[false,false,false]} colliders={false}  onCollisionEnter={({other})=>{
        
        if(other.rigidBodyObject.name === "groundnew"){
            // console.log(isOnFloor.current)
            isOnFloor.current = true;
        }}} 
       
        >
  <group ref={group} dispose={null}  castShadow>
    <primitive object={clone} ref={avatar} castshadow  />
    </group>
    {/* <PerspectiveCamera makeDefault position={[2,5,2]} isPerspectiveCamera castShadow ref={camera}/> */}
     <CapsuleCollider args={[0.61,0.3]} position={[0,0.9,0]}/>
     {/* <Capsule /> */}
    </RigidBody>
    </group>
  )
}

useGLTF.preload('/models/animations/M_Walk_001.glb')
useGLTF.preload('/models/animations/M_Standing_Idle_002.glb')
useGLTF.preload('/models/animations/M_Dances_001.glb')
useGLTF.preload('/models/animations/M_Run_001.glb')
useGLTF.preload('/models/animations/M_Run_Jump_001.glb')
useGLTF.preload('/models/animations/M_Standing_Expressions_001.glb')
useGLTF.preload('/models/animations/M_Standing_Expressions_005.glb')
useGLTF.preload('/models/animations/M_Standing_Expressions_006.glb')
useGLTF.preload('/models/animations/M_Standing_Idle_Variations_009.glb')
useGLTF.preload('/models/animations/M_Talking_Variations_001.glb')
useGLTF.preload('/models/animations/M_Jog_Jump_002.glb')
