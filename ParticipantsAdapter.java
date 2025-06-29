package com.autodialer.app;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import java.util.List;

public class ParticipantsAdapter extends RecyclerView.Adapter<ParticipantsAdapter.ViewHolder> {
    
    private List<String> participants;
    
    public ParticipantsAdapter(List<String> participants) {
        this.participants = participants;
    }
    
    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
            .inflate(R.layout.item_participant, parent, false);
        return new ViewHolder(view);
    }
    
    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        String number = participants.get(position);
        holder.numberText.setText(formatPhoneNumber(number));
    }
    
    @Override
    public int getItemCount() {
        return participants.size();
    }
    
    private String formatPhoneNumber(String number) {
        String cleanNumber = number.replaceAll("[^0-9]", "");
        
        switch (cleanNumber.length()) {
            case 11:
                return cleanNumber.substring(0, 2) + " " + 
                       cleanNumber.substring(2, 7) + "-" + 
                       cleanNumber.substring(7);
            case 10:
                return cleanNumber.substring(0, 2) + " " + 
                       cleanNumber.substring(2, 6) + "-" + 
                       cleanNumber.substring(6);
            default:
                return cleanNumber;
        }
    }
    
    public static class ViewHolder extends RecyclerView.ViewHolder {
        public TextView numberText;
        
        public ViewHolder(@NonNull View itemView) {
            super(itemView);
            numberText = itemView.findViewById(R.id.numberText);
        }
    }
}
