package com.OsborneStewartPokemonSnapIRLProject2.api.viewmodels;

import androidx.annotation.NonNull;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

import com.OsborneStewartPokemonSnapIRLProject2.api.models.User;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.auth.AuthResult;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.auth.UserProfileChangeRequest;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;

import java.util.Objects;


public class UserViewModel extends ViewModel {
    FirebaseAuth auth;
    DatabaseReference database;
    MutableLiveData<User> user = new MutableLiveData<>();
    MutableLiveData<RuntimeException> loginError = new MutableLiveData<>();

    public UserViewModel() {
        database = FirebaseDatabase.getInstance().getReference();
        database.addValueEventListener(new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot snapshot) {
                if(auth.getUid() != null) {
                    FirebaseUser fbUser = auth.getCurrentUser();
                    user.setValue(new User(fbUser));
                    if(snapshot.child("/userData").child(auth.getUid()).child("profile").getValue() != null){
                        user.getValue().profile = Objects.requireNonNull(snapshot.child("/userData").child(auth.getUid()).child("profile").getValue()).toString();
                        user.getValue().score = (long)snapshot.child("/userData").child(auth.getUid()).child("score").getValue();
                    }
                }
            }

            @Override
            public void onCancelled(@NonNull DatabaseError error) {

            }
        });

        this.auth = FirebaseAuth.getInstance();
        this.auth.addAuthStateListener(new FirebaseAuth.AuthStateListener() {
            @Override
            public void onAuthStateChanged(@NonNull FirebaseAuth firebaseAuth) {
                loginError.setValue(null);
                FirebaseUser fbUser = auth.getCurrentUser();

                if (fbUser == null) {
                    user.setValue(null);
                } else {
                    user.setValue(new User(fbUser));
                }
            }
        });
    }

    public MutableLiveData<User> getUser() {
        return user;
    }

    public void setUserProfile(String type){
        User updatedUser = user.getValue();
        assert updatedUser != null;
        updatedUser.profile = type;
        user.setValue(updatedUser);
        database.child("/userData").child(Objects.requireNonNull(auth.getCurrentUser()).getUid()).child("profile").setValue(user.getValue().profile);
    }

    public void increaseUserScore(long points){
        user.getValue().score += points;
        database.child("/userData").child(Objects.requireNonNull(auth.getCurrentUser()).getUid()).child("score").setValue(user.getValue().score);
    }

    public void signUp(String email, String userName, String password) {
        auth.createUserWithEmailAndPassword(email, password).addOnCompleteListener(task -> {
            if(task.isSuccessful()){
                FirebaseUser fbu = FirebaseAuth.getInstance().getCurrentUser();
                UserProfileChangeRequest profileUpdates = new UserProfileChangeRequest.Builder()
                        .setDisplayName(userName).build();
                assert fbu != null;
                fbu.updateProfile(profileUpdates)
                        .addOnCompleteListener(new OnCompleteListener<Void>() {
                            @Override
                            public void onComplete(@NonNull Task<Void> task) {
                                if (task.isSuccessful()) {
                                    user.setValue(new User(fbu));
                                    database.child("/userData").child(Objects.requireNonNull(auth.getCurrentUser()).getUid()).child("username").setValue(user.getValue().username);
                                    database.child("/userData").child(auth.getCurrentUser().getUid()).child("profile").setValue(user.getValue().profile);
                                    database.child("/userData").child(auth.getCurrentUser().getUid()).child("score").setValue(user.getValue().score);
                                }
                            }
                        });
            }
            else{
                loginError.setValue(new RuntimeException("Signup failed"));
            }
        });
    }

    public void signIn(String email, String password) {
        auth.signInWithEmailAndPassword(email, password); //.addOnCompleteListener();
    }

    public void signOut() {
        auth.signOut();
    }

    public String getUsername(){

        if(user.getValue() != null){
            if(user.getValue().username == null){
                user.getValue().username = "USERNAME IS NULL";
            }
        }
        else{
            FirebaseUser fbu = FirebaseAuth.getInstance().getCurrentUser();
            user.setValue(new User(fbu));
        }
        return user.getValue().username;
    }
}

