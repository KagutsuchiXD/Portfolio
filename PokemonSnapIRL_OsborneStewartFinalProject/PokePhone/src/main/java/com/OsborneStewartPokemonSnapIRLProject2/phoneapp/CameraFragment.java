package com.OsborneStewartPokemonSnapIRLProject2.phoneapp;

import android.Manifest;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.hardware.Camera;
import android.net.Uri;
import android.os.Bundle;
import android.os.Environment;
import android.provider.MediaStore;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.FrameLayout;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.content.FileProvider;
import androidx.fragment.app.Fragment;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class CameraFragment extends Fragment {
    private Camera mCamera;
    private CameraPreview mPreview;
    private long additionalPoints;

    public CameraFragment() {
        // Required empty public constructor
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_camera, container, false);
        Button takePicture = view.findViewById(R.id.button_capture);
        TextView notifier = view.findViewById(R.id.notification);
        notifier.setText(((MainActivity)requireActivity()).closePokeInfo);
        if(((MainActivity) requireActivity()).closePokeInfo.contains("vulpix")){
            additionalPoints = 100;
        }
        else if(((MainActivity) requireActivity()).closePokeInfo.contains("pikachu")){
            additionalPoints = 50;
        }
        else if(((MainActivity) requireActivity()).closePokeInfo.contains("No Pokemon")){
            additionalPoints = 0;
        }
        else{
            additionalPoints = 25;
        }

        if(requireActivity().checkSelfPermission(Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED){
            requireActivity().requestPermissions(new String[]{Manifest.permission.CAMERA, Manifest.permission.WRITE_EXTERNAL_STORAGE}, 1);
        }

        if(requireActivity().checkSelfPermission(Manifest.permission.CAMERA) == PackageManager.PERMISSION_GRANTED){

            System.out.println("VIEW--------------- " + view.toString());
            mCamera = getCameraInstance();
            mCamera.setDisplayOrientation(90);
            mPreview = new CameraPreview(getContext(), mCamera);
            FrameLayout preview = view.findViewById(R.id.camera_preview);

            mPreview.surfaceCreated(mPreview.getHolder());
            preview.addView(mPreview);

            takePicture.setOnClickListener((view1) -> {
                // increase user score
                ((MainActivity)requireActivity()).viewModel.increaseUserScore(additionalPoints);

                // get an image from the camera
                mCamera.takePicture(null, null, (data, camera) -> {
                    FileOutputStream outStream;
                    try {
                        File file = new File(Environment.getExternalStorageDirectory() + "/DCIM/Camera");
                        file.mkdir();
                        outStream = new FileOutputStream(new File(Environment.getExternalStorageDirectory() + "/DCIM/Camera", System.currentTimeMillis() + ".jpg"), true);
                        Log.d("PATH------ ", "file path " + Environment.getExternalStorageDirectory() + "/DCIM/Camera/" + System.currentTimeMillis() + ".jpg");
                        outStream.write(data);
                        outStream.close();
                        Log.d("PICTURE TAKEN ", "onPictureTaken - wrote bytes: " + data.length);
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                    Log.d("DONE TAKEN PICTURE ", "onPictureTaken - jpeg");
                    getActivity().getSupportFragmentManager().beginTransaction()
                            .replace(R.id.fragment_container, HomeFragment.class, null)
                            .setReorderingAllowed(true)
                            .addToBackStack(null)
                            .commit();
                });
            });
        }
        return view;
    }

    private boolean checkCameraHardware(Context context) {
        if (context.getPackageManager().hasSystemFeature(PackageManager.FEATURE_CAMERA)){
            // this device has a camera
            return true;
        } else {
            // no camera on this device
            return false;
        }
    }

    public static Camera getCameraInstance(){
        Camera c = null;
        try {
            c = Camera.open(); // attempt to get a Camera instance
        }
        catch (Exception e){
            // Camera is not available (in use or does not exist)
        }
        return c; // returns null if camera is unavailable
    }

}