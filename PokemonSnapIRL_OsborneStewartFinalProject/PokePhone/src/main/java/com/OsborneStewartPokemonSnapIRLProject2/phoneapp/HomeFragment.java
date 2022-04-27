package com.OsborneStewartPokemonSnapIRLProject2.phoneapp;

import android.Manifest;
import android.content.ContentResolver;
import android.content.ContentValues;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.net.Uri;
import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;

import android.provider.MediaStore;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import com.OsborneStewartPokemonSnapIRLProject2.api.models.Pokemon;
import com.OsborneStewartPokemonSnapIRLProject2.api.viewmodels.PokemonPointsListModel;
import com.google.android.material.floatingactionbutton.FloatingActionButton;
import com.mapbox.geojson.Point;
import com.mapbox.mapboxsdk.Mapbox;
import com.mapbox.mapboxsdk.geometry.LatLng;
import com.mapbox.mapboxsdk.location.LocationComponent;
import com.mapbox.mapboxsdk.location.LocationComponentActivationOptions;
import com.mapbox.mapboxsdk.location.LocationComponentOptions;
import com.mapbox.mapboxsdk.location.OnCameraTrackingChangedListener;
import com.mapbox.mapboxsdk.location.OnLocationCameraTransitionListener;
import com.mapbox.mapboxsdk.location.modes.CameraMode;
import com.mapbox.mapboxsdk.location.modes.RenderMode;
import com.mapbox.mapboxsdk.maps.MapView;
import com.mapbox.mapboxsdk.maps.MapboxMap;
import com.mapbox.mapboxsdk.maps.OnMapReadyCallback;
import com.mapbox.mapboxsdk.maps.Style;
import com.mapbox.mapboxsdk.plugins.markerview.MarkerView;
import com.mapbox.mapboxsdk.plugins.markerview.MarkerViewManager;
import com.mapbox.turf.TurfMeasurement;

import java.util.concurrent.atomic.AtomicReference;

public class HomeFragment extends Fragment {
    protected PokemonPointsListModel pokeView;
    MapView mapView;
    MarkerView userMarker;
    Uri imageUri;
    Location currentLocation;
    public HomeFragment() {
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Mapbox.getInstance(requireActivity(), getResources().getString(R.string.mapbox_access_token));
        pokeView = new ViewModelProvider(this).get(PokemonPointsListModel.class);

    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_home, container, false);
        FloatingActionButton cameraFab = view.findViewById(R.id.camera_Fab);
        mapView = view.findViewById(R.id.map);

        cameraFab.setOnClickListener((view1 -> {
            //check to see if a pokemon will be put on the screen
            Point currentPoint = Point.fromLngLat(currentLocation.getLongitude(), currentLocation.getLatitude());
            pokeView.getPokemonList().forEach((pokemon) -> {
                Point pokePoint = Point.fromLngLat(pokemon.lon, pokemon.lat);
                double distance = TurfMeasurement.distance(currentPoint, pokePoint);
                if (distance * 3281 <= 200){
                    pokeView.setClosePoke(pokemon);
                    System.out.println(pokemon.species + " has been set");
                }
            });

            if(pokeView.getClosePoke() != null){
                Point pokePoint = Point.fromLngLat(pokeView.getClosePoke().lon, pokeView.getClosePoke().lat);
                double distance = TurfMeasurement.distance(currentPoint, pokePoint);
                if (distance * 3281 <= 200){
                    ((MainActivity)requireActivity()).closePokeInfo = "A wild " + pokeView.getClosePoke().species + " has appeared.";

                    System.out.println(pokeView.getClosePoke().species + " is currently the closest species of pokemon");
                    System.out.println("The distance between user and " + pokeView.getClosePoke().species + " is " + distance);
                }
                else{
                    ((MainActivity)requireActivity()).closePokeInfo = "No Pokemon close by.";
                }
            }


            getActivity().getSupportFragmentManager().beginTransaction()
                    .replace(R.id.fragment_container, CameraFragment.class, null)
                    .setReorderingAllowed(true)
                    .addToBackStack(null)
                    .commit();
        }));

        mapView.getMapAsync(new OnMapReadyCallback() {
            @Override
            public void onMapReady(@NonNull MapboxMap mapboxMap) {
                mapboxMap.setStyle(Style.MAPBOX_STREETS, new Style.OnStyleLoaded(){
                    @Override
                    public void onStyleLoaded(@NonNull Style style) {
                        if(requireActivity().checkSelfPermission(Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED){
                            requireActivity().requestPermissions(new String[]{Manifest.permission.ACCESS_FINE_LOCATION}, 1);
                        }
                        if(requireActivity().checkSelfPermission(Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED){
                            LocationManager manager = (LocationManager) requireActivity().getSystemService(Context.LOCATION_SERVICE);
                            currentLocation = manager.getLastKnownLocation(LocationManager.GPS_PROVIDER);
                            pokeView.setGrid(currentLocation.getLatitude() + 0.0165,
                                    currentLocation.getLatitude() - 0.0165,
                                    currentLocation.getLongitude() + 0.0165,
                                    currentLocation.getLongitude() - 0.0165);

                            LocationComponent locationComponent = mapboxMap.getLocationComponent();
                            locationComponent.activateLocationComponent(
                                    LocationComponentActivationOptions.builder(requireActivity(), style)
                                            .useSpecializedLocationLayer(true)
                                            .build()
                            );
                            locationComponent.setLocationComponentEnabled(true);
                            locationComponent.setCameraMode(CameraMode.TRACKING_GPS, new OnLocationCameraTransitionListener() {
                                @Override
                                public void onLocationCameraTransitionFinished(int cameraMode) {
                                    locationComponent.zoomWhileTracking(16, 100);
                                }

                                @Override
                                public void onLocationCameraTransitionCanceled(int cameraMode) {

                                }
                            });

                            switch (((MainActivity)requireActivity()).viewModel.getUser().getValue().profile){
                                case "Ash":
                                    ((MainActivity)requireActivity()).setUserPic(R.mipmap.ic_usermark_foreground);
                                    break;
                                case "Green":
                                    ((MainActivity)requireActivity()).setUserPic(R.mipmap.ic_usermarkgreen_foreground);
                                    break;
                                case "Harrison":
                                    ((MainActivity)requireActivity()).setUserPic(R.mipmap.ic_usermarkharrison_foreground);
                                    break;
                                case "May":
                                    ((MainActivity)requireActivity()).setUserPic(R.mipmap.ic_usermarkmay_foreground);
                                    break;
                                case "X":
                                    ((MainActivity)requireActivity()).setUserPic(R.mipmap.ic_usermarkx_foreground);
                                    break;
                                case "Serena":
                                    ((MainActivity)requireActivity()).setUserPic(R.mipmap.ic_usermarkserena_foreground);
                                    break;
                            }

                            locationComponent.zoomWhileTracking(16, 100);
                            LocationComponentOptions options = locationComponent.getLocationComponentOptions().toBuilder()
                                    .foregroundDrawable(((MainActivity)requireActivity()).getUserPic())
                                    .trackingGesturesManagement(true)
                                    .trackingInitialMoveThreshold(500)
                                    .build();
                            locationComponent.applyStyle(options);
                            locationComponent.setRenderMode(RenderMode.COMPASS);

                            locationComponent.addOnCameraTrackingChangedListener(new OnCameraTrackingChangedListener() {
                                @Override
                                public void onCameraTrackingDismissed() {
                                    System.out.println("DONE TRACKING");
                                    new Thread(() -> {
                                        try {
                                            Thread.sleep(5000);
                                        } catch (InterruptedException e) {
                                            e.printStackTrace();
                                        }
                                        requireActivity().runOnUiThread(() -> {
                                            locationComponent.setCameraMode(CameraMode.TRACKING_GPS_NORTH);
                                        });
                                    }).start();
                                }

                                @Override
                                public void onCameraTrackingChanged(int currentMode) {
                                    System.out.println("TRACKING CHANGED " + currentMode);
                                }
                            });

                            MarkerViewManager markerViewManager = new MarkerViewManager(mapView, mapboxMap);

                            pokeView.getPokemonList().forEach((pokemon) -> {
                                ImageView pokePic = (ImageView)LayoutInflater.from(getContext()).inflate(R.layout.pokepic, (ViewGroup)view, false);
                                pokePic.setAdjustViewBounds(true);
                                switch(pokemon.species){
                                    case "pikachu":
                                        pokePic.setImageResource(R.mipmap.ic_pikachu_round);
                                        break;
                                    case "bulbasaur":
                                        pokePic.setImageResource(R.mipmap.ic_bulbasaur_round);
                                        break;
                                    case "squirtle":
                                        pokePic.setImageResource(R.mipmap.ic_squirtle_round);
                                        break;
                                    case "charmander":
                                        pokePic.setImageResource(R.mipmap.ic_charmander_round);
                                        break;
                                    case "caterpie":
                                        pokePic.setImageResource(R.mipmap.ic_caterpie_round);
                                        break;
                                    case "weedle":
                                        pokePic.setImageResource(R.mipmap.ic_weedle_round);
                                        break;
                                    case "pidgey":
                                        pokePic.setImageResource(R.mipmap.ic_pidgey_round);
                                        break;
                                    case "rattata":
                                        pokePic.setImageResource(R.mipmap.ic_rattata_round);
                                        break;
                                    case "spearow":
                                        pokePic.setImageResource(R.mipmap.ic_spearow_round);
                                        break;
                                    case "ekans":
                                        pokePic.setImageResource(R.mipmap.ic_ekans_round);
                                        break;
                                    case "sandshrew":
                                        pokePic.setImageResource(R.mipmap.ic_sandshrew_round);
                                        break;
                                    case "nidorang":
                                        pokePic.setImageResource(R.mipmap.ic_nidorang_round);
                                        break;
                                    case "nidoranb":
                                        pokePic.setImageResource(R.mipmap.ic_nidoranb_round);
                                        break;
                                    case "clefairy":
                                        pokePic.setImageResource(R.mipmap.ic_clefairy_round);
                                        break;
                                    case "vulpix":
                                        pokePic.setImageResource(R.mipmap.ic_vulpix_round);
                                        break;
                                    case "jigglypuff":
                                        pokePic.setImageResource(R.mipmap.ic_jigglypuff_round);
                                        break;
                                }
                                MarkerView pokeMarker = new MarkerView(new LatLng(pokemon.lat, pokemon.lon), pokePic);
                                markerViewManager.addMarker(pokeMarker);
                            });

                            manager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 1000, 1, new LocationListener() {
                                @Override
                                public void onLocationChanged(@NonNull Location location) {
                                    System.out.println("Location Changed");
                                    currentLocation = location;

                                }
                            });
                        }
                    }
                });
            }
        });
        return view;
    }
}