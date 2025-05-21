export async function loadDataFromFiles(file) {
    console.log(`loading ${file}`);
    const response = await fetch(file);
    if (!response.ok) throw new Error(`Failed to load file: ${response.status} ${response.statusText}`);
    const text = await response.text();


    const pointCloudData = {
        positions: [],
        colors: [],
    };


    const lines = text.split('\n');
    lines.forEach(line => {
        if (line.length == 0) return;

        const l = line.split(' ');
        const pointStr = l[0].split(',');
        const rgbStr = l[1].split(',');

        pointCloudData.positions.push(Number(pointStr[0]), Number(pointStr[1]), Number(pointStr[2]));
        pointCloudData.colors.push(Number(rgbStr[0]) / 255, Number(rgbStr[1]) / 255, Number(rgbStr[2]) / 255);
    });

    return pointCloudData;
}


/*
the depth map is generated for the ADT specifically: https://facebookresearch.github.io/projectaria_tools/docs/open_datasets/aria_digital_twin_dataset
"combined with groundtruth data generated using a motion capture system including depth images, device trajectories, object trajectories and bounding boxes, and human tracking"



depth_images.vrs: https://facebookresearch.github.io/projectaria_tools/docs/open_datasets/aria_digital_twin_dataset/data_format#depth_imagesvrs
"Depth data is calculated using ADT’s ground truth system"

the ground truth data has
2d_bounding_boxes.csv, 3d_bounding_boxes.csv, aria_trajectory.csv, eyegaze.csv, instances.json, metadata.json, scene_objects.csv

fucking meta
*/