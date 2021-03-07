package product

// Product stores the productID, productName, and productLink
type Product struct {
	ProductID   int64  `json:"productID"`
	ProductName string `json:"productName"`
	ProductLink string `json:"productLink"`
}
