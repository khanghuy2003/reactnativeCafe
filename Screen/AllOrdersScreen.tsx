import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator, Alert, Dimensions } from 'react-native';
import database, { DataSnapshot } from '@react-native-firebase/database';
import { Order } from '../type/type';
import Modal from 'react-native-modal';

const screenWidth = Dimensions.get('window').width;

const AllOrdersScreen = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusLoading, setStatusLoading] = useState(false);

  // Fetch Orders from Firebase
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const usersRef = database().ref('/users');

      try {
        const snapshot = await usersRef.once('value');
        const allOrders: Order[] = [];

        snapshot.forEach((userSnapshot):any => {
          const ordersSnapshot = userSnapshot.child('orders');

          ordersSnapshot.forEach((orderSnapshot):any => {
            const orderData = orderSnapshot.val();
            allOrders.push(orderData);
          });
        });

        setOrders(allOrders);
      } catch (error) {
        console.log('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Render order item
  const renderItem = ({ item }: { item: Order }) => (
    <TouchableOpacity onPress={() => handleOrderPress(item)}>
      <View style={styles.orderItem}>
        <Text style={styles.orderTitle}>Mã đơn: {item.orderId}</Text>
        <Text>Địa chỉ: {item.address}</Text>
        <Text>SĐT: {item.phone}</Text>
        <Text>Thanh toán: {item.paymentMethod}</Text>
        <Text>Ngày đặt: {item.orderDateTime}</Text>
        <Text>Trạng thái: {item.status}</Text>
      </View>
    </TouchableOpacity>
  );

  // Get Style based on status
  const getStatusStyle = (status: string | undefined) => {
    if (status === 'Đã hủy') return { ...styles.orderStatus, color: '#e53935' };
    if (status === 'Đã hoàn thành') return { ...styles.orderStatus, color: '#43a047' };
    return styles.orderStatus;
  };

  // Handle Modal
  const handleOrderPress = (order: Order) => {
    setSelectedOrder(order);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedOrder(null);
  };

  // Update Order Status Function
  // Update Order Status Function
  const updateOrderStatus = async (status: string) => {
    if (!selectedOrder || !selectedOrder.orderId) {
      Alert.alert('Lỗi', 'Không thể cập nhật trạng thái đơn hàng');
      return;
    }
  
    setStatusLoading(true);
  
    try {
      // Đường dẫn đến tất cả các đơn hàng của tất cả người dùng
      const usersRef = database().ref('/users');
  
      // Lấy snapshot tất cả người dùng
      const snapshot = await usersRef.once('value');
  
      // Dùng Object.entries() để lấy các key và value từ snapshot
      const users = snapshot.val();
  
      // Dùng vòng lặp for...of để lặp qua tất cả người dùng
      for (const userKey in users) {
        const userSnapshot = users[userKey];
        const ordersSnapshot = userSnapshot.orders;
  
        // Dùng vòng lặp for...of để lặp qua tất cả các đơn hàng của người dùng
        for (const orderKey in ordersSnapshot) {
          const orderData = ordersSnapshot[orderKey];
  
          // Nếu tìm thấy đơn hàng cần cập nhật
          if (orderData.orderId === selectedOrder.orderId) {
            const orderRef = database().ref(`/users/${userKey}/orders/${orderKey}`);
  
            // Cập nhật trạng thái cho đơn hàng
            await orderRef.update({
              status: status
            });
  
            // Cập nhật lại orders trong state
            setOrders(prevOrders => 
              prevOrders.map(order => 
                order.orderId === selectedOrder.orderId 
                  ? { ...order, status: status } 
                  : order
              )
            );
  
            // Cập nhật selectedOrder để hiển thị trạng thái mới trong modal
            setSelectedOrder({ ...selectedOrder, status: status });
  
            Alert.alert('Thành công', `Đơn hàng đã được cập nhật thành "${status}"`);
          }
        }
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      Alert.alert('Lỗi', 'Không thể cập nhật trạng thái đơn hàng');
    } finally {
      setStatusLoading(false);
    }
  };
  
  
  

  // Delete Order Function
  const handleDeleteOrder = (orderId: string) => {
    Alert.alert('Xác nhận xóa', 'Bạn có chắc chắn muốn xóa đơn hàng này không?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        onPress: () => {
          const orderRef = database().ref(`/users/${orderId}/orders`);
          orderRef.remove().then(() => {
            console.log('Order deleted successfully');
            setOrders((prevOrders) => prevOrders.filter((order) => order.orderId !== orderId));
          }).catch((error) => {
            console.error('Error deleting order:', error);
          });
        },
      },
    ]);
  };

  // Custom product item renderer for the modal
  const renderProductItem = ({ item }: { item: any }) => (
    <View style={styles.productItem}>
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.cartItemName}</Text>
        <Text style={styles.productDetail}>Size: {item.cartItemSize}</Text>
        <Text style={styles.productDetail}>Số lượng: {item.cartItemQuantity}</Text>
        <Text style={styles.productDetail}>Giá: {item.cartItemTotalPrice}</Text>
      </View>
      {item.cartItemImageUrl && (
        <Image
          source={{ uri: item.cartItemImageUrl.toString() }}
          style={styles.productImage}
          resizeMode="contain"
        />
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Tất cả đơn hàng</Text>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderItem}
          keyExtractor={(item) => item.orderId?.toString()}
        />
      )}

      {/* Modal to show order details */}
      <Modal isVisible={isModalVisible} onBackdropPress={closeModal}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Chi tiết sản phẩm trong hóa đơn</Text>
          
          {/* Hiển thị trạng thái hiện tại */}
          {selectedOrder && (
            <View style={styles.statusContainer}>
              <Text style={styles.statusLabel}>Trạng thái hiện tại:</Text>
              <Text>{selectedOrder.status}</Text>
            </View>
          )}
          
          {selectedOrder?.orderItems ? (
            <FlatList
              data={selectedOrder.orderItems}
              renderItem={renderProductItem}
              keyExtractor={(item, index) => index.toString()}
              style={styles.productList}
              contentContainerStyle={styles.productListContent}
            />
          ) : (
            <Text>Không có sản phẩm trong đơn hàng này.</Text>
          )}
          
          {/* Buttons container */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              onPress={() => updateOrderStatus('Đã hủy')} 
              style={[styles.actionButton, styles.cancelButton]}
              disabled={statusLoading}
            >
              <Text style={styles.buttonText}>Hủy đơn</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={closeModal} 
              style={styles.closeButton}
              disabled={statusLoading}
            >
              <Text style={styles.closeButtonText}>Đóng</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={() => updateOrderStatus('Đã hoàn thành')} 
              style={[styles.actionButton, styles.completeButton]}
              disabled={statusLoading}
            >
              <Text style={styles.buttonText}>Hoàn thành</Text>
            </TouchableOpacity>
          </View>
          
          {statusLoading && (
            <View style={styles.statusLoadingContainer}>
              <ActivityIndicator size="small" color="#007bff" />
              <Text style={styles.statusLoadingText}>Đang cập nhật...</Text>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  header: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderItem: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  orderTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  orderStatus: {
    fontWeight: 'bold',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: screenWidth * 0.9,
    maxHeight: '80%',
    alignSelf: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  statusLabel: {
    marginRight: 10,
    fontSize: 14,
  },
  productList: {
    width: '100%',
    marginBottom: 10,
  },
  productListContent: {
    paddingBottom: 10,
  },
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  productInfo: {
    flex: 1,
    paddingRight: 10,
  },
  productName: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  productDetail: {
    fontSize: 14,
    color: '#555',
    marginBottom: 3,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  closeButton: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
  },
  actionButton: {
    padding: 12,
    borderRadius: 8,
    flex: 1,
  },
  cancelButton: {
    backgroundColor: '#e53935',
  },
  completeButton: {
    backgroundColor: '#43a047',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  statusLoadingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  statusLoadingText: {
    marginLeft: 10,
    color: '#666',
  },
});

export default AllOrdersScreen;