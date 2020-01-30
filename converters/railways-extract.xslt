<xsl:stylesheet version="2.0"
		xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
		xmlns:xs="http://www.w3.org/2001/XMLSchema"
		xmlns:kml="http://earth.google.com/kml/2.1"
		exclude-result-prefixes="kml xs">
	<xsl:output method="xml" indent="yes" cdata-section-elements="description"/>
	
	<xsl:template match="/">
		<points>
			<xsl:apply-templates select="node()" />
		</points>
	</xsl:template>

	<xsl:template match="@*|node()">
		<xsl:apply-templates select="@*|node()" />
	</xsl:template>
	
	<xsl:template match="kml:Placemark">
		<point>
			<name><xsl:value-of select="kml:name" /></name>
			<coordinates><xsl:value-of select="kml:Point/kml:coordinates" /></coordinates>
			<description><xsl:value-of select="kml:description" /></description>
			<folders>
				<xsl:for-each select="ancestor::kml:Folder">
					<folder><xsl:value-of select="kml:name"></xsl:value-of></folder>
				</xsl:for-each>
			</folders>
		</point>
	</xsl:template>
	
</xsl:stylesheet>
