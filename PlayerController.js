import * as three from 'three';

export let keys = {
    w: false,
    a: false,
    s: false,
    d: false,
    space: false,
    lshift: false,
}


export function setupController() {
    document.addEventListener('keydown', function(ev) {
             if (ev.key === 'w')     keys.w      = true;
        else if (ev.key === 's')     keys.s      = true;
        else if (ev.key === 'a')     keys.a      = true;
        else if (ev.key === 'd')     keys.d      = true;
        else if (ev.key === ' ')     keys.space  = true;
        else if (ev.key === 'Shift') keys.lshift = true;
    });
    
    document.addEventListener('keyup', function(ev) {
             if (ev.key === 'w')     keys.w      = false;
        else if (ev.key === 's')     keys.s      = false;
        else if (ev.key === 'a')     keys.a      = false;
        else if (ev.key === 'd')     keys.d      = false;
        else if (ev.key === ' ')     keys.space  = false;
        else if (ev.key === 'Shift') keys.lshift = false;
    });
    
    document.addEventListener('wheel', function(ev) {
        const scrollDir = ev.wheelDeltaY / Math.abs(ev.wheelDeltaY);
        const sensitivity = 0.5;
        
        speed += scrollDir * sensitivity;
        speed = Math.max(speed, 0);

        document.getElementById("speed").innerText = `Speed: ${speed}`
    });

    document.getElementById("speed").innerText = `Speed: ${speed}`
}


let direction = new three.Vector3();
let clock = new three.Clock();
let speed = 3;
export function movePlayer(controls) {
    const deltaTime = clock.getDelta();

    direction.x = Number(keys.d) - Number(keys.a);
    direction.y = Number(keys.space) - Number(keys.lshift);
    direction.z = Number(keys.w) - Number(keys.s);
    direction.normalize();

    let velocity = new three.Vector3(0, 0, 0);

    if (keys.a || keys.d) 
        velocity.x -= direction.x * speed;
    if (keys.space || keys.lshift) 
        velocity.y -= direction.y * speed;
	if (keys.w || keys.s) 
        velocity.z -= direction.z * speed;


    controls.moveRight(velocity.x * deltaTime * -1);
    controls.object.position.y += velocity.y * deltaTime * -1 * 0.5;
	controls.moveForward(velocity.z * deltaTime * -1);

}