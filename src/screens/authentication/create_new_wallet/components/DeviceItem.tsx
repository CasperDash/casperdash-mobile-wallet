import React, {Component, useState} from "react";
import {
    Text,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator
} from "react-native";

interface DeviceItemProps {
    device: any
    onSelect: (device: any) => void,
}

const DeviceItem = ({device, onSelect}: DeviceItemProps) => {
    const [pending, setPending] = useState<boolean>(false);

    const onPress = async () => {
        setPending(true);
        try {
            onSelect(device);
        } finally {
            setPending(false);
        }
    };

    return (
        <TouchableOpacity
            style={styles.deviceItem}
            onPress={onPress}
            disabled={pending}>
            <Text style={styles.deviceName}>{device.name}</Text>
            {pending ? <ActivityIndicator/> : null}
        </TouchableOpacity>
    );
}

export default DeviceItem;

const styles = StyleSheet.create({
    deviceItem: {
        paddingVertical: 16,
        paddingHorizontal: 32,
        marginVertical: 8,
        marginHorizontal: 16,
        borderColor: "#ccc",
        borderWidth: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    deviceName: {
        fontSize: 20,
        fontWeight: "bold"
    }
});
