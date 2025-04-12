import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  ScrollView, 
  Dimensions, 
  ActivityIndicator, 
  TouchableOpacity, 
  Image,
  StyleSheet,
  SafeAreaView
} from "react-native";
import { PieChart } from "react-native-chart-kit";
import database from '@react-native-firebase/database';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../type/type";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

interface Product {
  product_name: string;
  product_salescount: number;
}

interface PieChartItem {
  name: string;
  sales: number;
  color: string;
  legendFontColor: string;
  legendFontSize: number;
}

type StatisticsScreenProps = NativeStackScreenProps<RootStackParamList, "StatisticsScreen">;

const StatisticsScreen = ({ navigation }: StatisticsScreenProps) => {
  const [chartData, setChartData] = useState<PieChartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snapshot = await database()
          .ref('products')
          .once('value');

        if (snapshot.exists()) {
          const rawData = snapshot.val();
          const productsArray: Product[] = Object.values(rawData);

          const validProducts = productsArray.filter(
            (p) =>
              typeof p.product_salescount === "number" &&
              typeof p.product_name === "string"
          );

          const topProducts = validProducts
            .sort((a, b) => b.product_salescount - a.product_salescount)
            .slice(0, 6);

          // Danh sách màu hài hòa cho biểu đồ
          const colorPalette = [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40',
            '#8AC249', '#EA526F', '#71A0CA', '#FFD166'
          ];

          const pieData: PieChartItem[] = topProducts.map((item, index) => ({
            name: item.product_name.length > 15 ? 
                  item.product_name.substring(0, 15) + "..." : 
                  item.product_name,
            sales: item.product_salescount,
            color: colorPalette[index % colorPalette.length],
            legendFontColor: "#333",
            legendFontSize: 12,
          }));

          setChartData(pieData);
          setError(null);
        } else {
          console.log("Không có dữ liệu sản phẩm");
          setChartData([]);
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
        setError("Lỗi khi tải dữ liệu. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6384" />
        <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (chartData.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Không có dữ liệu sản phẩm để hiển thị.</Text>
      </View>
    );
  }

  // Custom Legend component - để hiển thị chú thích bên dưới
  const ChartLegend = () => (
    <View style={styles.legendContainer}>
      <Text style={styles.legendTitle}>Chú thích:</Text>
      {chartData.map((item, index) => (
        <View key={index} style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: item.color }]} />
          <Text style={styles.legendText}>
            {item.name} - {item.sales} lượt bán
          </Text>
        </View>
      ))}
    </View>
  );

  // Tính tổng số lượng bán
  const totalSales = chartData.reduce((sum, item) => sum + item.sales, 0);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <Image 
              style={styles.backIcon}
              source={require('../assets/backbtn.png')}
              resizeMode='contain'
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Thống kê bán hàng</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.chartInfoContainer}>
          <Text style={styles.chartTitle}>Biểu đồ lượt bán sản phẩm</Text>
          <Text style={styles.chartSubtitle}>Top {chartData.length} sản phẩm bán chạy nhất</Text>
          <Text style={styles.totalSales}>Tổng số lượt bán: {totalSales}</Text>
        </View>

        <View style={styles.chartContainer}>
          <PieChart
            data={chartData}
            width={screenWidth - 40}  // Giảm width để tạo padding
            height={220}
            chartConfig={{
              backgroundColor: "#ffffff",
              backgroundGradientFrom: "#ffffff",
              backgroundGradientTo: "#ffffff",
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor="sales"
            backgroundColor="transparent"
            paddingLeft="0"
            absolute={false}
            hasLegend={false}  // Tắt legend mặc định
            center={[screenWidth / 4, 0]}  // Căn giữa chart
          />
        </View>

        {/* Custom Legend ở bên dưới */}
        <ChartLegend />
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>Dữ liệu được cập nhật theo thời gian thực</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    height: 24,
    width: 24,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 40,  // Để giữ cân đối với nút back
  },
  chartInfoContainer: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  chartSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  totalSales: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 8,
    color: '#FF6384',
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  legendContainer: {
    marginHorizontal: 20,
    marginTop: 20,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  footer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  errorText: {
    color: '#d9534f',
    fontSize: 16,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default StatisticsScreen;