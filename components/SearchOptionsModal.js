import { View, Text, Pressable, Modal } from "react-native";
import Slider from "@react-native-community/slider";
import React from "react";
import styles from "../styles/homeScreenStyles";

export default function SearchOptionsModal({
  visible,
  onClose,
  matchCount,
  setMatchCount,
  matchThreshold,
  setMatchThreshold,
  isSearching,
  onSearch,
}) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Søgeindstillinger</Text>
            <Pressable onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </Pressable>
          </View>

          {/* Match Count */}
          <View style={styles.optionGroup}>
            <Text style={styles.optionLabel}>
              Antal resultater: {matchCount}
            </Text>
            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={50}
              step={1}
              value={matchCount}
              onValueChange={setMatchCount}
              minimumTrackTintColor="#007AFF"
              maximumTrackTintColor="#e0e0e0"
            />
            <View style={styles.sliderLabels}>
              <Text style={styles.sliderLabel}>1</Text>
              <Text style={styles.sliderLabel}>50</Text>
            </View>
          </View>

          {/* Match Threshold */}
          <View style={styles.optionGroup}>
            <Text style={styles.optionLabel}>
              Matchgrænse (relevans): {matchThreshold.toFixed(2)}
            </Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={1}
              step={0.05}
              value={matchThreshold}
              onValueChange={setMatchThreshold}
              minimumTrackTintColor="#007AFF"
              maximumTrackTintColor="#e0e0e0"
            />
            <View style={styles.sliderLabels}>
              <Text style={styles.sliderLabel}>0 (lavt)</Text>
              <Text style={styles.sliderLabel}>1 (højt)</Text>
            </View>
          </View>

          {/* Buttons */}
          <View style={styles.modalButtons}>
            <Pressable
              onPress={onSearch}
              style={[styles.button, styles.searchButton]}
              disabled={isSearching}
            >
              <Text style={styles.buttonText}>
                {isSearching ? "Søger..." : "Søg"}
              </Text>
            </Pressable>

            <Pressable
              onPress={onClose}
              style={[styles.button, styles.cancelButton]}
            >
              <Text style={styles.cancelButtonText}>Annuller</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
