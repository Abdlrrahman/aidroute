# Operations Research Methodology & Cost Formulations

## 1. Multi-Objective Dijkstra Algorithm

Each road corridor edge $e = (u, v)$ has a multi-dimensional traversal cost:

$$W(e) = w_d \cdot D(e) + w_t \cdot T(e) + w_r \cdot R_{\text{threat}}(e) + w_c \cdot C(e)$$

Where transit time $T(e)$ incorporates road surface coefficients ($k_{\text{surface}}$):

$$T(e) = \frac{D(e)}{\text{BaseSpeed} \times k_{\text{surface}}} + (\text{Checkpoints} \times \text{Delay} \times k_{\text{shock}})$$

## 2. Ton-Kilometer Unit Cost Accounting

$$\text{Cost per Ton-Km} = \frac{\text{Total Mission Cost}}{\sum \text{Payload Tons} \times \text{Total Distance Km}}$$

## 3. Cold-Chain Excursion Risk Function

$$\text{Risk} = \begin{cases} 
\text{Safe}, & T_{\text{transit}} \le 14\text{ hrs} \\
\text{Warning}, & 14\text{ hrs} < T_{\text{transit}} \le 24\text{ hrs} \\
\text{Critical Excursion}, & T_{\text{transit}} > 24\text{ hrs}
\end{cases}$$
